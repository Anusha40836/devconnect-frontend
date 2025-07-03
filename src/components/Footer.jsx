function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-5">
      <p>
        © {new Date().getFullYear()} Anusha |{" "}
        <a
          href="https://github.com/Anusha40836"
          className="text-white"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}

export default Footer;
