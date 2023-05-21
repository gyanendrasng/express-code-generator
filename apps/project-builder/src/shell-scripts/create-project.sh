echo "\nCreating project $1"
mkdir $1
cd $1
npm init -y
touch index.js

echo "\nstarting node installation"
npm install express cookie-parser
echo "\nnode installation completed"
rm -rf node_modules
echo "\nNode modules removed successfully"

echo "\ncreating .env and .gitignore file"
touch .env
touch .gitignore
echo "\n.env and .gitignore file created successfully"

echo "\nNode.js project created successfully"