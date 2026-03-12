import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../../util/config';
import { Toast } from '../../util/Toast_';
import MuxPlayer from '@mux/mux-player-react';

const MuxPlayerComponent = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [playerData, setPlayerData] = useState({
    playbackId: '',
    signedVideoUrl: '',
    signedThumbnailUrl: '',
    drmLicenseToken: '',
    metadata: {
      video_id: '',
      video_title: '',
      viewer_user_id: '',
      episode_id: '',
      series_title: ''
    }
  });

  useEffect(() => {
    const fetchSignedUrls = async () => {
      try {
        // Get playbackId from URL params
        const params = new URLSearchParams(location.search);
        const playbackId = params.get('playbackId');
        const drmEnabled = params.get('drmEnabled') === 'true';
        
        if (!playbackId) {
          Toast("error", "No playback ID provided");
          setLoading(false);
          return;
        }

        // Get signed URLs from backend with DRM parameter
        const { data } = await axios.get(`${baseURL}movie/hls-signed-url/admin?hlsFileName=${playbackId}&drm=${drmEnabled}`);
        
        if (data.status) {
          setPlayerData({
            playbackId,
            signedVideoUrl: data.signedVideoUrl,
            signedThumbnailUrl: data.signedThumbnailUrl,
            drmLicenseToken: data.drmLicenseToken,
            metadata: {
              video_id: playbackId,
              video_title: params.get('title') || 'Video Title',
              viewer_user_id: params.get('userId') || 'default-user',
              episode_id: params.get('episodeId') || '',
              series_title: params.get('seriesTitle') || ''
            }
          });
        } else {
          Toast("error", "Failed to get signed URLs");
        }
      } catch (error) {
        console.error('Error fetching signed URLs:', error);
        Toast("error", "Error loading video");
      } finally {
        setLoading(false);
      }
    };

    fetchSignedUrls();
  }, [location]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid" style={{height: '100vh', overflowX: 'hidden'}}>
      <div className="row">
        <div className="col-12">
          <div className="page-title-box d-sm-flex align-items-center justify-content-between mt-2 mb-3">
            <h4 className="ml-3">
              {playerData.metadata.series_title && playerData.metadata.video_title 
                ? `${playerData.metadata.series_title} - ${playerData.metadata.video_title}`
                : 'Mux Video Player'
              }
            </h4>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              {playerData.playbackId && (
                <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
                  <MuxPlayer
                    playbackId={playerData.playbackId}
                    metadata={{
                      video_id: playerData.metadata.video_id,
                      video_title: playerData.metadata.video_title,
                      viewer_user_id: playerData.metadata.viewer_user_id
                    }}
                    tokens={{
                      playback: playerData.signedVideoUrl.split('token=')[1],
                      thumbnail: playerData.signedThumbnailUrl.split('token=')[1],
                      drm: playerData.drmLicenseToken
                    }}
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      borderRadius: '8px'
                    }}
                    streamType="on-demand"
                    preferPlayback="mse"
                    debug={false}
                    minResolution="720p"
                    maxResolution="1080p"
                    autoPlay={false}
                    muted={false}
                    loop={false}
                    thumbnailTime={0}
                    startTime={0}
                    onPlayerReady={() => console.log('Player is ready')}
                    onPlay={() => console.log('Video started playing')}
                    onPause={() => console.log('Video paused')}
                    onEnded={() => console.log('Video ended')}
                    onError={(error) => {
                      console.error('Player error:', error);
                      Toast("error", "Error playing video");
                    }}
                  />
                </div>
              )}
              
              {!playerData.playbackId && !loading && (
                <div style={{ 
                  width: '100%', 
                  maxWidth: '800px', 
                  margin: '0 auto',
                  textAlign: 'center',
                  padding: '40px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '2px dashed #dee2e6'
                }}>
                  <i className="ri-video-line" style={{ fontSize: '48px', color: '#6c757d', marginBottom: '16px' }}></i>
                  <h5 style={{ color: '#6c757d', marginBottom: '8px' }}>No Video Available</h5>
                  <p style={{ color: '#6c757d', margin: 0 }}>
                    This episode doesn't have video content or the video is not properly configured.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MuxPlayerComponent; 