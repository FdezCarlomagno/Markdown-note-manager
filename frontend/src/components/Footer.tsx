import githubSvg from '../assets/github.svg';
import linkedinSvg from '../assets/linkedin.svg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const svgStyles = 'w-10 h-auto hover:scale-[1.1] transition duration-200';

  return (
    <footer className=" text-gray-300 py-6 mt-8 border-t border-gray-500">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <p className="text-sm">&copy; {currentYear} Valentin F. Carlomagno. All rights reserved.</p>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://github.com/FdezCarlomagno"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors duration-300"
          >
            <img src={githubSvg} alt="GitHub" className={svgStyles} />
          </a>
          <a
            href="https://www.linkedin.com/in/valentin-f-carlomagno-10683b338/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors duration-300"
          >
            <img src={linkedinSvg} alt="LinkedIn" className={svgStyles} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;