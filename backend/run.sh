docker stop prj
docker rm prj

docker build -t prj .
docker run -d -p 8080:8080 --restart always --name prj prj

docker image prune -f