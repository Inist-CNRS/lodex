#!/bin/bash

# This script renames a MongoDB database and adds a document to a collection in the new database.

# Get parameters from command line arguments or use default values
# MONGO_HOST: The host of the MongoDB instance.
# PREFIX: The prefix to add to the database name.
MONGO_HOST=$1
DATABASE_NAME=$2
PREFIX=$3

# Check that all variables are set
if [ -z "$MONGO_HOST" ] || [ -z "$DATABASE_NAME" ] || [ -z "$PREFIX" ]; then
    echo "All parameters must be set. Usage: ./migrate-tenant.sh <mongo_host> <database_name> <prefix>"
    exit 1
fi

# LOWERCASE the database name and prefix
DATABASE_NAME=$(echo "$DATABASE_NAME" | tr '[:upper:]' '[:lower:]')
PREFIX=$(echo "$PREFIX" | tr '[:upper:]' '[:lower:]')

# CONCAT PREFIX and DATABASE_NAME. AND CUT TO 63 CHARS
PREFIX_DATABASE_NAME=$(echo "$PREFIX"_"$DATABASE_NAME" | cut -c1-63)



echo "-------------------"
echo "Migrating database $DATABASE_NAME to ${PREFIX_DATABASE_NAME}"
mongodump --archive="archive-db" --db=$DATABASE_NAME --quiet
mongorestore --archive="archive-db" --nsFrom="$DATABASE_NAME.*" --nsTo="$PREFIX_DATABASE_NAME.*" --quiet
rm archive-db

echo "Database renamed successfully."
echo "-------------------"

echo "-------------------"
echo "Adding tenant to ${PREFIX}_admin"
mongo --host $MONGO_HOST <<EOF
    use ${PREFIX}_admin;
    db.tenant.insert(
        {
            name: "${DATABASE_NAME}",
            description: '',
            author: 'MIGRATION',
            username: 'admin',
            password: 'secret',
            createdAt: new Date(),
        }
    );
EOF
echo "-------------------"


echo "-------------------"
echo "Adding tenant to $PREFIX_DATABASE_NAME"
file=$(cat configTenant.json)
mongo --host $MONGO_HOST <<EOF
    use ${PREFIX_DATABASE_NAME};
    var count = db.configTenant.count();
    if (count == 0) {
        db.configTenant.insert($file);
        print("configTenant is empty. Document inserted.");
    } else {
        print("configTenant is not empty. No document inserted.");
    }
EOF
echo "-------------------"



