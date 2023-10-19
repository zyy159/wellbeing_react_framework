import React from 'react';

const PrivacyPolicy = () => {
    const [htmlContent, setHtmlContent] = React.useState("");

    React.useEffect(() => {
        fetch('/PrivacyPolicy.html')
            .then(response => response.text())
            .then(data => setHtmlContent(data));
    }, []);

    return (
        <div
            dangerouslySetInnerHTML={{ __html: htmlContent }}
            style={{ maxHeight: '300px', overflowY: 'auto' }} // 设置高度并在超出时显示滚动条
        />
    );
}

export default PrivacyPolicy;
