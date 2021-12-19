#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 本地打包
yarn build

# 导航到构建输出目录
cd docs/.vitepress/dist

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

# 提交
git init
git add -A
git commit -m '🚀 部署至 Jinyang79.github.io'

# 推送至 https://github.com/Jinyang79/Jinyang79.github.io
git push -f https://github.com/Jinyang79/Jinyang79.github.io.git master

cd -