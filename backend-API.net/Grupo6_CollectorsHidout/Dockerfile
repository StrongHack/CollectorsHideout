# Use the .NET SDK image for building the application
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /app

# Copy the ASP.NET application files to the container
COPY . ./

# Restore dependencies and build the application
RUN dotnet restore
RUN dotnet build -c Release -o /app/build

# Publish the ASP.NET application
RUN dotnet publish -c Release -o /app/publish

# Use the ASP.NET runtime image for deploying the published application
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8000
# Set the entry point for running the ASP.NET application
ENTRYPOINT ["dotnet", "Grupo6_CollectorsHidout.dll"]