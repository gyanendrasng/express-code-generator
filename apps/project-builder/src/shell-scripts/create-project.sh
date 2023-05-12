echo "Creating project $1"
mkdir $1
cd $1
npm init -y
touch index.js
npm install express cookie-parser
echo "Node.js project created successfully"