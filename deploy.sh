#!/bin/bash

# set exit on any failed command
set -e

# Get options
while getopts 'ht:' flag; do
  case "${flag}" in
    t) target="${OPTARG}" ;;
    h) echo "pass a target with -t *required) ex. -t dev" exit 1 ;;
  esac
done

# Variables
prod="hotsauce-backoffice"
dev="hotsauce-backoffice-testing"
uri="s3://${!target}.hotsaucepos.com"
prodID=""
devID=""

# npm build project
echo ""
echo "-------------------"
echo "Installing dependencies and building for ${target}"
echo "${uri}"
echo "-------------------"
npm && npm build

# sync delete s3 bucket
echo ""
echo "-------------------"
echo "Sync delete target ${target}"
echo "${uri}"
echo "-------------------"
aws s3 sync --delete ./build ${uri}

# create invalidation for cloudfront distribution
echo ""
echo "------------------"
echo "Creating invalidation for CloudFront Distribution ${distribution}"
if [[ "$target" == "prod" ]]
then
aws cloudfront create-invalidation --distribution ${prodID} --paths "/*"
else
aws cloudfront create-invalidation --distribution ${devID} --paths "/*"
fi
