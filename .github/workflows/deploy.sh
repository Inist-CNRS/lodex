echo "Deploying"
dir_path=$(dirname $(realpath $0))
echo $dir_path
make -C $dir_path/../.. publish