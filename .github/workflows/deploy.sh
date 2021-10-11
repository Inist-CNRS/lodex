HEAD_TAG=$(git tag --points-at HEAD)
REF=${GITHUB_REF##*/}
if [ "$HEAD_TAG" != "" ] && [ "$REF" = "master" ]
then 
    echo "Deploying"
    dir_path=$(dirname $(realpath $0))
    echo $dir_path
    make -C $dir_path/../.. publish
else 
    echo "Ignore deploy"    
fi