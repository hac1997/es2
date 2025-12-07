import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

const LatexRenderer = ({ children }) => {
    if (!children) return null;
    return (
        <Latex>{children}</Latex>
    );
};

export default LatexRenderer;
