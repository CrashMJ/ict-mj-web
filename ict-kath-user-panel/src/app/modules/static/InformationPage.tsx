// import { QueryRequestProvider } from './core/QueryRequestProvider'
import { KTCard, toAbsoluteUrl } from '../../../_metronic/helpers'

import DocViewer from "@cyntler/react-doc-viewer";
import { useState } from 'react';

const Information = () => {

  return (
    <>
      <KTCard>
        <img
          src={toAbsoluteUrl('/media/static/info.png')}
          className='h-50 align-self-center mt-10 mb-10'
          style={{ width: '90%' }}
          alt=''
        />

      <img
          src={toAbsoluteUrl('/media/static/guide 2.jpg')}
          className='h-50 align-self-center mt-10 mb-10'
          style={{ width: '90%' }}
          alt=''
        />
      </KTCard>
    </>
  )
}

const InformationPage = () => (
  <Information />
)

export { InformationPage }
