import type { Route } from "./+types/home";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const Home = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-xl md:text-4xl font-bold mb-4">Welcome to Studio X</h1>
      <p className="text-lg text-gray-700">Discover your favorite artists and albums.</p>
    </div>
  );
};

export default Home;

