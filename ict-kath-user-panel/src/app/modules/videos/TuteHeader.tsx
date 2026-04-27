/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { KTSVG, toAbsoluteUrl } from '../../../_metronic/helpers'
import { useLocation } from 'react-router'
import { GCP_STORAGE_BASE_URL } from '../../../config'

type Props = {
  videoInfo?: any,
  buyInfo?: any
}

const TuteHeader: React.FC<Props> = ({ videoInfo, buyInfo }) => {
  const handleDownloadPdf = (fileId: string) => {
  
    if (fileId) {
      const directDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId.trim()}`;

      const link = document.createElement('a');
      link.href = directDownloadUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.download = 'lesson.pdf'; // Change as needed

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("Invalid Google Drive URL.");
    }
};

  return (
    <div className='card mb-5 mb-xl-10'>
          <div className='card-body pt-9 pb-0'>
            <div className="row py-5">
              <div className="col-12 text-center mb-4">
                {videoInfo.icon && (
                  <img 
                    src={`${GCP_STORAGE_BASE_URL}${videoInfo.icon}`} 
                    alt='ICT Kathurusingha' 
                    className="w-25 h-100 rounded"
                  />
                )}
              </div>
            </div>
            <div className="row py-3">
              <div className="col-12 text-center">
                <h3 className="mt-3">{videoInfo.name}</h3>
              </div>
            </div>
            <div className="row justify-content-center text-center gap-5">
              <div className="col-10 ">
                <p>{videoInfo.description}</p>
              </div>
            </div>
            <div className="row justify-content-center py-5">
              <div className="col-12 col-md-6 d-flex flex-column flex-md-row justify-content-between align-items-center p-3 border rounded bg-light gap-3">
                <div>
                  <i className="bi bi-tag me-2 text-primary"></i>
                  <span>Price: <strong>Rs.{videoInfo.price}</strong></span>
                </div>
                <div>
                  <i className="bi bi-play-circle me-2 text-primary"></i>
                  <span>Tutes: <strong>{videoInfo.tute_url ? videoInfo.tute_url.split(',').length : 0}</strong></span>
                </div>
              </div>
            </div>
    
            
            {/* Trailer Section */}
              {videoInfo.trailer && (
                <div className="row justify-content-center my-4 py-5">
                  <div className="col-md-8 col-sm-12">
                    <div className="ratio ratio-16x9">
                      <iframe
                        src={videoInfo.trailer}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="rounded"
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}
    
    
            {/* Lessons Section */}
            <div className="row text-center py-5">
              <h4>Download Tutes Now</h4>
              <p>පහත Tutes මිලදී ගැනීමට ඔබට ලියාපදිංචි විය යුතුය</p>
            </div>
            <div className="row justify-content-center py-5">
              <div className="col-12 col-md-6">
                {/* <h5>What will you learn from this course</h5> */}
                <div className="d-flex justify-content-center align-items-center py-2 border-bottom flex-wrap gap-2">
                {buyInfo && buyInfo.payment_status === 'approved' && buyInfo.status === 'active' ? (
                    <>
                    
                        {videoInfo.tute_url && 
                          videoInfo.tute_url.split(',').map((url: any, index: number) => (
                            <button
                              key={index} 
                              className='btn btn-sm btn-warning'
                              onClick={() => handleDownloadPdf(url)}
                            >
                              Tute {index + 1} <i className="bi bi-download"></i>
                            </button>
                          ))
                        }
                    </>
                  ) : (
                    <>
                      {videoInfo.tute_url &&
                        videoInfo.tute_url.split(',').map((url: any, index: number) => (
                          <button key={index} className='btn btn-sm btn-secondary' disabled>Tute {index + 1} <i className="bi bi-download"></i></button>
                        ))
                      }

                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  
  )
}

export { TuteHeader }


