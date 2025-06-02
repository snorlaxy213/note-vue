#!/bin/bash

# Note Vue 部署脚本
# 支持多环境部署和回滚功能

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 默认配置
DEFAULT_ENV="production"
DEFAULT_SERVER="localhost"
DEFAULT_PATH="/var/www/note-vue"
DEFAULT_USER="www-data"
DEFAULT_PORT="22"

# 配置变量
ENVIRONMENT=${ENVIRONMENT:-$DEFAULT_ENV}
SERVER=${SERVER:-$DEFAULT_SERVER}
DEPLOY_PATH=${DEPLOY_PATH:-$DEFAULT_PATH}
DEPLOY_USER=${DEPLOY_USER:-$DEFAULT_USER}
SSH_PORT=${SSH_PORT:-$DEFAULT_PORT}
BACKUP_COUNT=${BACKUP_COUNT:-5}

# 显示帮助信息
show_help() {
    cat << EOF
Note Vue 部署脚本

用法: $0 [选项] [命令]

命令:
  deploy     部署到服务器 (默认)
  rollback   回滚到上一个版本
  status     检查部署状态
  backup     创建备份
  clean      清理旧版本

选项:
  -e, --env ENV        目标环境 (production|staging|development)
  -s, --server HOST    服务器地址
  -p, --path PATH      部署路径
  -u, --user USER      SSH 用户名
  --port PORT          SSH 端口
  --backup-count N     保留备份数量
  --dry-run            模拟运行，不执行实际操作
  -v, --verbose        详细输出
  -h, --help           显示帮助信息

环境变量:
  ENVIRONMENT          目标环境
  SERVER               服务器地址
  DEPLOY_PATH          部署路径
  DEPLOY_USER          SSH 用户名
  SSH_PORT             SSH 端口
  BACKUP_COUNT         保留备份数量

示例:
  $0 deploy --env production --server example.com
  $0 rollback --env staging
  $0 status

EOF
}

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查必要的工具
check_requirements() {
    log_info "检查部署环境..."
    
    # 检查必要的命令
    local required_commands=("ssh" "scp" "rsync" "tar")
    for cmd in "${required_commands[@]}"; do
        if ! command -v "$cmd" &> /dev/null; then
            log_error "缺少必要的命令: $cmd"
            exit 1
        fi
    done
    
    # 检查构建文件
    if [ ! -d "dist" ]; then
        log_error "未找到构建文件，请先运行构建脚本"
        exit 1
    fi
    
    log_success "环境检查通过"
}

# 测试 SSH 连接
test_ssh_connection() {
    log_info "测试 SSH 连接..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 跳过 SSH 连接测试"
        return 0
    fi
    
    if ssh -p "$SSH_PORT" -o ConnectTimeout=10 -o BatchMode=yes "$DEPLOY_USER@$SERVER" "echo 'SSH 连接成功'" &> /dev/null; then
        log_success "SSH 连接测试通过"
    else
        log_error "SSH 连接失败，请检查服务器配置"
        exit 1
    fi
}

# 创建备份
create_backup() {
    log_info "创建部署备份..."
    
    local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="$DEPLOY_PATH/backups/$backup_name"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 将创建备份: $backup_path"
        return 0
    fi
    
    # 在服务器上创建备份目录
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "mkdir -p $DEPLOY_PATH/backups"
    
    # 如果当前部署存在，创建备份
    if ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "[ -d $DEPLOY_PATH/current ]"; then
        ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "cp -r $DEPLOY_PATH/current $backup_path"
        log_success "备份创建完成: $backup_name"
        
        # 清理旧备份
        clean_old_backups
    else
        log_warning "当前部署不存在，跳过备份"
    fi
}

# 清理旧备份
clean_old_backups() {
    log_info "清理旧备份..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 将保留最新 $BACKUP_COUNT 个备份"
        return 0
    fi
    
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "
        cd $DEPLOY_PATH/backups 2>/dev/null || exit 0
        ls -1t | tail -n +$((BACKUP_COUNT + 1)) | xargs -r rm -rf
    "
    
    log_success "旧备份清理完成"
}

# 上传文件
upload_files() {
    log_info "上传构建文件..."
    
    local release_name="release-$(date +%Y%m%d-%H%M%S)"
    local release_path="$DEPLOY_PATH/releases/$release_name"
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 将上传到: $release_path"
        return 0
    fi
    
    # 创建发布目录
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "mkdir -p $release_path"
    
    # 使用 rsync 上传文件
    rsync -avz --delete -e "ssh -p $SSH_PORT" dist/ "$DEPLOY_USER@$SERVER:$release_path/"
    
    if [ $? -eq 0 ]; then
        log_success "文件上传完成"
        echo "$release_name" > .last_release
    else
        log_error "文件上传失败"
        exit 1
    fi
}

# 更新符号链接
update_symlink() {
    log_info "更新部署符号链接..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 将更新符号链接"
        return 0
    fi
    
    local release_name=$(cat .last_release)
    local release_path="$DEPLOY_PATH/releases/$release_name"
    
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "
        cd $DEPLOY_PATH
        ln -sfn releases/$release_name current
    "
    
    if [ $? -eq 0 ]; then
        log_success "符号链接更新完成"
    else
        log_error "符号链接更新失败"
        exit 1
    fi
}

# 重启服务
restart_services() {
    log_info "重启相关服务..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 将重启 Nginx 服务"
        return 0
    fi
    
    # 重启 Nginx
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "sudo systemctl reload nginx" || {
        log_warning "Nginx 重启失败，请手动检查"
    }
    
    log_success "服务重启完成"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 跳过健康检查"
        return 0
    fi
    
    # 检查网站是否可访问
    local check_url="http://$SERVER"
    local max_attempts=5
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$check_url" | grep -q "200\|301\|302"; then
            log_success "健康检查通过"
            return 0
        fi
        
        log_warning "健康检查失败，重试 $attempt/$max_attempts"
        sleep 5
        ((attempt++))
    done
    
    log_error "健康检查失败，部署可能有问题"
    return 1
}

# 部署函数
deploy() {
    log_info "开始部署到 $ENVIRONMENT 环境..."
    
    check_requirements
    test_ssh_connection
    create_backup
    upload_files
    update_symlink
    restart_services
    
    if health_check; then
        log_success "🎉 部署完成！"
        
        # 显示部署信息
        cat << EOF

部署信息:
========
环境: $ENVIRONMENT
服务器: $SERVER
路径: $DEPLOY_PATH/current
时间: $(date)
EOF
    else
        log_error "部署完成但健康检查失败，请检查应用状态"
        exit 1
    fi
}

# 回滚函数
rollback() {
    log_info "开始回滚..."
    
    if [ "$DRY_RUN" = true ]; then
        log_info "[DRY RUN] 模拟回滚操作"
        return 0
    fi
    
    # 获取最新的备份
    local latest_backup=$(ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "ls -1t $DEPLOY_PATH/backups | head -n1")
    
    if [ -z "$latest_backup" ]; then
        log_error "未找到可用的备份"
        exit 1
    fi
    
    log_info "回滚到备份: $latest_backup"
    
    # 执行回滚
    ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "
        cd $DEPLOY_PATH
        rm -rf current
        cp -r backups/$latest_backup current
    "
    
    restart_services
    
    if health_check; then
        log_success "🔄 回滚完成！"
    else
        log_error "回滚完成但健康检查失败"
        exit 1
    fi
}

# 状态检查
check_status() {
    log_info "检查部署状态..."
    
    # 检查当前部署
    local current_release=$(ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "readlink $DEPLOY_PATH/current 2>/dev/null || echo 'none'")
    
    echo "当前部署: $current_release"
    
    # 检查可用备份
    local backups=$(ssh -p "$SSH_PORT" "$DEPLOY_USER@$SERVER" "ls -1t $DEPLOY_PATH/backups 2>/dev/null || echo 'none'")
    
    echo "可用备份:"
    echo "$backups" | head -5
    
    # 检查服务状态
    health_check
}

# 解析命令行参数
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -e|--env)
                ENVIRONMENT="$2"
                shift 2
                ;;
            -s|--server)
                SERVER="$2"
                shift 2
                ;;
            -p|--path)
                DEPLOY_PATH="$2"
                shift 2
                ;;
            -u|--user)
                DEPLOY_USER="$2"
                shift 2
                ;;
            --port)
                SSH_PORT="$2"
                shift 2
                ;;
            --backup-count)
                BACKUP_COUNT="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -v|--verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            deploy|rollback|status|backup|clean)
                COMMAND="$1"
                shift
                ;;
            *)
                log_error "未知选项: $1"
                show_help
                exit 1
                ;;
        esac
    done
}

# 主函数
main() {
    # 默认命令
    COMMAND=${COMMAND:-"deploy"}
    
    # 显示配置信息
    if [ "$VERBOSE" = true ]; then
        cat << EOF
配置信息:
========
命令: $COMMAND
环境: $ENVIRONMENT
服务器: $SERVER
路径: $DEPLOY_PATH
用户: $DEPLOY_USER
端口: $SSH_PORT
备份数量: $BACKUP_COUNT
模拟运行: ${DRY_RUN:-false}

EOF
    fi
    
    # 执行对应命令
    case $COMMAND in
        deploy)
            deploy
            ;;
        rollback)
            rollback
            ;;
        status)
            check_status
            ;;
        backup)
            create_backup
            ;;
        clean)
            clean_old_backups
            ;;
        *)
            log_error "未知命令: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    parse_args "$@"
    main
fi