#!/bin/bash

CHAIN_ID=$1

TARGET_DIR="../clusters/$CHAIN_ID"
DELETE_TARGET="/home/ubuntu/clusters/$CHAIN_ID" 
if [ -d "$TARGET_DIR" ]; then
    # Navigate to the directory
    cd "$TARGET_DIR" || { echo "Failed to navigate to $TARGET_DIR"; exit 1; }
    echo "Navigated to $(pwd)"
else
    echo "Directory $TARGET_DIR does not exist."
    exit 1
fi

aws eks --region eu-central-1 update-kubeconfig --name $CHAIN_ID
helm uninstall ingress-nginx -n my-space
terraform destroy -auto-approve


deleted_item="$CHAIN_ID"
echo "Deleted: $deleted_item" >> ../Deleted.txt

if [ -d "$TARGET_DIR" ]; then
    # Navigate to the directory
    rm -r "$DELETE_TARGET" || { echo "Failed to Delete the $DELETE_TARGET"; exit 1; }
    echo "Deleted"
else
    echo "Directory $DELETE_TARGET does not exist."
    exit 1
fi



echo "Destroyed! 🎉"