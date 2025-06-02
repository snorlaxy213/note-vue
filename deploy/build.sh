#!/bin/bash

# Note Vue 构建脚本
# 用于生产环境构建和优化

set -e  # 遇到错误立即退出

echo "🚀 开始构建 Note Vue 项目..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查 Node.js 版本
check_node_version() {
    echo -e "${BLUE}检查 Node.js 版本...${NC}"
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    REQUIRED_VERSION="14.0.0"
    
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo -e "${GREEN}✓ Node.js 版本检查通过: $NODE_VERSION${NC}"
    else
        echo -e "${RED}✗ Node.js 版本过低，需要 >= $REQUIRED_VERSION，当前版本: $NODE_VERSION${NC}"
        exit 1
    fi
}

# 检查依赖
check_dependencies() {
    echo -e "${BLUE}检查项目依赖...${NC}"
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}⚠ 未找到 node_modules，开始安装依赖...${NC}"
        npm ci
    else
        echo -e "${GREEN}✓ 依赖检查通过${NC}"
    fi
}

# 运行代码检查
run_lint() {
    echo -e "${BLUE}运行代码检查...${NC}"
    npm run lint
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 代码检查通过${NC}"
    else
        echo -e "${RED}✗ 代码检查失败${NC}"
        exit 1
    fi
}

# 清理旧的构建文件
clean_build() {
    echo -e "${BLUE}清理旧的构建文件...${NC}"
    if [ -d "dist" ]; then
        rm -rf dist
        echo -e "${GREEN}✓ 清理完成${NC}"
    else
        echo -e "${YELLOW}⚠ 未找到旧的构建文件${NC}"
    fi
}

# 构建项目
build_project() {
    echo -e "${BLUE}开始构建项目...${NC}"
    
    # 设置生产环境变量
    export NODE_ENV=production
    
    # 运行构建命令
    npm run build
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ 项目构建成功${NC}"
    else
        echo -e "${RED}✗ 项目构建失败${NC}"
        exit 1
    fi
}

# 分析构建结果
analyze_build() {
    echo -e "${BLUE}分析构建结果...${NC}"
    
    if [ -d "dist" ]; then
        # 计算构建文件大小
        BUILD_SIZE=$(du -sh dist | cut -f1)
        echo -e "${GREEN}✓ 构建文件大小: $BUILD_SIZE${NC}"
        
        # 列出主要文件
        echo -e "${BLUE}主要构建文件:${NC}"
        find dist -name "*.js" -o -name "*.css" | head -10 | while read file; do
            size=$(du -h "$file" | cut -f1)
            echo -e "  ${YELLOW}$file${NC} ($size)"
        done
        
        # 检查是否有 source map
        if find dist -name "*.map" | grep -q .; then
            echo -e "${YELLOW}⚠ 发现 source map 文件，生产环境建议移除${NC}"
        fi
    else
        echo -e "${RED}✗ 构建目录不存在${NC}"
        exit 1
    fi
}

# 生成构建报告
generate_report() {
    echo -e "${BLUE}生成构建报告...${NC}"
    
    REPORT_FILE="build-report-$(date +%Y%m%d-%H%M%S).txt"
    
    cat > "$REPORT_FILE" << EOF
Note Vue 构建报告
==================

构建时间: $(date)
Node.js 版本: $(node -v)
npm 版本: $(npm -v)
构建环境: $NODE_ENV

构建文件:
$(find dist -type f | sort)

文件大小统计:
$(du -sh dist)

JS 文件:
$(find dist -name "*.js" -exec du -h {} \; | sort -hr)

CSS 文件:
$(find dist -name "*.css" -exec du -h {} \; | sort -hr)

构建完成时间: $(date)
EOF

    echo -e "${GREEN}✓ 构建报告已生成: $REPORT_FILE${NC}"
}

# 主函数
main() {
    echo -e "${GREEN}=== Note Vue 构建脚本 ===${NC}"
    echo -e "${BLUE}开始时间: $(date)${NC}"
    
    # 检查是否在项目根目录
    if [ ! -f "package.json" ]; then
        echo -e "${RED}✗ 请在项目根目录运行此脚本${NC}"
        exit 1
    fi
    
    # 执行构建步骤
    check_node_version
    check_dependencies
    run_lint
    clean_build
    build_project
    analyze_build
    generate_report
    
    echo -e "${GREEN}🎉 构建完成！${NC}"
    echo -e "${BLUE}结束时间: $(date)${NC}"
}

# 处理命令行参数
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-lint)
            SKIP_LINT=true
            shift
            ;;
        --skip-clean)
            SKIP_CLEAN=true
            shift
            ;;
        --analyze)
            ANALYZE_ONLY=true
            shift
            ;;
        -h|--help)
            echo "用法: $0 [选项]"
            echo "选项:"
            echo "  --skip-lint    跳过代码检查"
            echo "  --skip-clean   跳过清理步骤"
            echo "  --analyze      仅分析现有构建"
            echo "  -h, --help     显示帮助信息"
            exit 0
            ;;
        *)
            echo -e "${RED}未知选项: $1${NC}"
            echo "使用 -h 或 --help 查看帮助信息"
            exit 1
            ;;
    esac
done

# 根据参数执行不同逻辑
if [ "$ANALYZE_ONLY" = true ]; then
    analyze_build
else
    main
fi