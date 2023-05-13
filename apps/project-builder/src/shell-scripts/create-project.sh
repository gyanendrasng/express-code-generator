echo "Creating project $1"
mkdir $1
cd $1
npm init -y
touch index.js
echo "starting node installation"
npm install express cookie-parser
echo "node installation completed"
echo "Node.js project created successfully"