rm -rf src/main/resources/static

cd ../frontend
npm run build

mv dist ../backend/src/main/resources/static

cd ../backend

./gradlew bootJar

scp -i src/main/resources/secret/key1121.pem build/libs/backend-0.0.1-SNAPSHOT.jar ubuntu@13.209.19.129:./prj.jar

ssh -i src/main/resources/secret/key1121.pem ubuntu@13.209.19.129 './run.sh'