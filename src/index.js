import http from "http";
import app from "./app";

const PORT = 3000;

const server = http.createServer(app);
server.listen(PORT, err => {
	if (err) {
		throw err;
	}
	console.log(`Server listening on port ${PORT}`);
});
