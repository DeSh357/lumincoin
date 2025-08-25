export class FileUtils {
    static loadPageStyle(src: string) {
        const link: HTMLLinkElement = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = src;
        if (src.includes("sidebar.css")) {
            link.id = 'sidebar-styles';
        } else {
            link.classList.add('created');
        }
        document.head.appendChild(link);
    }
}