const VMIX = () => {
  const videoId = '-nlWA1jJe5E';

  return (
    <div style={{ textAlign: 'center', marginTop: '20px', background: 'black' }}>
      <iframe
        width="1024"
        height="500"
        src={`http://www.youtube.com/embed/${videoId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ maxWidth: '100%' }}
        title="YouTube Live Stream"
      />
    </div>
  );
};

export default VMIX;
