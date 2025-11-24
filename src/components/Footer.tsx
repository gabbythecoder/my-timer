import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="flex justify-between items-center m-1">
      <p className="text-xs tracking-wide m-1 p-1">
        &copy; Gabby French 2025 | Made with ❤️ in the UK
      </p>

      <div className="flex gap-2 m-1 p-1 text-[var(--foreground)]">
        <a
          href="https://github.com/gabbythecoder"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Github"
        >
          <FaGithub size={24} />
        </a>

        <a
          href="https://www.linkedin.com/in/gabbyy-frenchh/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Linkedin"
        >
          <FaLinkedin size={24} />
        </a>
      </div>
    </footer>
  );
}
