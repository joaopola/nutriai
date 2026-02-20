import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { Settings } from "./components/Settings";

function App() {
	return (
		<Layout>
			<Dashboard />
			<Settings />
		</Layout>
	);
}

export default App;
