import { useEffect } from "react";

const Analytics = () => {
    useEffect(() => {
        const script1 = document.createElement("script");
        script1.src = "https://www.googletagmanager.com/gtag/js?id=G-X45GD0FG8F";
        script1.async = true;
        document.head.appendChild(script1);

        const script2 = document.createElement("script");
        script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-X45GD0FG8F', {
        send_page_view: true
      });
    `;
        document.head.appendChild(script2);
    }, []);

    return null;
};

export default Analytics;
