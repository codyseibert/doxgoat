$(cd client && npm run build)
cp -Rf client/dist/* server/public
git add --all
git commit -m 'deploy'
git push