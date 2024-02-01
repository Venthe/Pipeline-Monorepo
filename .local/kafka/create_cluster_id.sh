/bin/bash

file_path="/tmp/clusterID/clusterID"

set -o errexit

if [ ! -f "$file_path" ]; then
  /bin/kafka-storage random-uuid > ${file_path}
  echo "Cluster id has been created..."
  cat "\t${file_path}"
fi
