FROM openjdk:21
ENV TZ=Asia/Seoul
COPY prj.jar prj.jar


ENTRYPOINT ["java", "-jar", "--enable-preview", "prj.jar"]