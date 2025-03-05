const VideoPlayer = ({ url }) => {
    return (
        <div>
            <iframe
            width="560"
            height="315"
            src={url}
            title="Video Player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            >
            </iframe>
        </div>
    )
}

export default VideoPlayer;


  
