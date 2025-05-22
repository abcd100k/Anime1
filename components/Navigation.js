import Link from 'next/link';

const Navigation = () => {
  console.log("Rendering Navigation component");

  return (
    <nav>
      <Link href={"/"} style={{ color: 'red' }}>Home</Link>
      <Link href={"/search/result?q=Anime Movie"} style={{ color: 'red' }}>Anime Movie</Link> {/* Update here */}
      <Link href={"https://t.me/mximexyz"} style={{ color: 'red' }}>Contact</Link>
    </nav>
  );
};

export default Navigation;
