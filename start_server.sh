# add the env variables
vi /etc/profile

# add the below configurations to the end of file
export NODE_HOME=/usr/local/lib/nodejs/node-v18.16.0-linux-x64
export PATH=$PATH:$NODE_HOME/bin

# refresh the configurations
source /etc/profile

# verification
node -v
npm -v

# check the installation path of node
which node
