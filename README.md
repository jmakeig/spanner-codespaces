# Spanner Skeleton Codespace Configuration

This project template builds a Codespace container with the minimal configuration to connect to a Spanner PostgreSQL dialect database. It installs the `gcloud` commandline tool to authenticate to Google Cloud and runs PGAdapter in a separate container, listening over `localhost:5432`, the default PostgreSQL port.

This set-up uses Node.js, but can easlily be configured to run any stack, using Docker Compose.

1. Fork this project from the GitHub web UI.
1. In the GitHub web UI in your fork, create a new Codespace from the green “Code” button on the repository homepage. 

   This will build a container and launch a pre-configured VS Code instance in your browser. It may take several minutes the first time.
1. From VS Code, make a copy of the file, `.env.EXAMPLE` in your project and name it, `.env`.
1. Update the values in `.env` to your GCP project and Spanner instance and database names. These will be used to connect to Spanner from your application.
1. Authenticate your terminal session to Google Cloud
  
	`gcloud config set project «your-project-name» && gcloud auth application-default login`
	
	When prompted, follow the link to login in your browser and paste the generated authentication code back into the VS Code terminal.
1. In the terminal window of VS Code, run `npm install` 
1. Run `./test.js` to connect to the database and run a (read-only) query
