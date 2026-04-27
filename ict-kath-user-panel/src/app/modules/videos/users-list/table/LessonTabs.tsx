import { useEffect, useMemo, useState } from 'react'
import SVG from 'react-inlinesvg'
import { KTCardBody, KTSVG, toAbsoluteUrl } from '../../../../../_metronic/helpers'

const LessonTabs = () => {
  const [selectedOption, setSelectedOption] = useState<'OL' | 'AL' | null>(null)
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedClassType, setSelectedClasstype] = useState<string | null>(null)
  const [selectedLessonType, setSelectedLessonType] = useState<string | null>(null)

  const handleOptionClick = (option: 'OL' | 'AL') => {
    setSelectedOption(option)
    setSelectedGrade(null) // Reset grade selection when option changes
    setSelectedLessonType(null)
    setSelectedClasstype(null)
  }

  const handleGradeClick = (grade: string | null) => {
    if (grade) {
      setSelectedGrade(grade)
      setSelectedLessonType(null)
      setSelectedClasstype(null)
    }
  }

  const handleClassTypeClick = (classType: string) => {
    setSelectedClasstype(classType)
    setSelectedLessonType(null)

  }

  const handleLessonTypeClick = (type: string) => {
    setSelectedLessonType(type)
  }

  return (
    <KTCardBody className='py-4'>
      <div className="text-center mb-6">
        <h2 className="fw-bold text-primary">Explore Class and Lessons Options</h2>
        <p className="text-muted">Choose your preferred class or Lessons package to get started.</p>
      </div>

      {/* Class Options */}
      <div className="d-flex flex-wrap justify-content-center gap-4 mb-6">
        <div
          className="card shadow-sm p-4 text-center cursor-pointer"
          style={{
            maxWidth: '300px',
            backgroundColor: selectedOption === 'OL' ? '#fa541c' : 'white',
            border: '1px solid #dee2e6',
            transform: selectedOption === 'OL' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => handleOptionClick('OL')}
        >
          <h4 className={`fw-bold mb-4 ${selectedOption === 'OL' ? 'text-white' : 'text-dark'}`}>O/L Classes</h4>
          <p className={selectedOption === 'OL' ? 'text-secondary' : 'text-muted'}>Select and explore O/L class grades.</p>
        </div>

        <div
          className="card shadow-sm p-4 text-center cursor-pointer"
          style={{
            maxWidth: '300px',
            backgroundColor: selectedOption === 'AL' ? '#fa541c' : 'white',
            border: '1px solid #dee2e6',
            transform: selectedOption === 'AL' ? 'scale(1.05)' : 'scale(1)',
            transition: 'all 0.3s ease',
          }}
          onClick={() => handleOptionClick('AL')}
        >
          <h4 className={`fw-bold mb-4 ${selectedOption === 'AL' ? 'text-white' : 'text-dark'}`}>A/L Classes</h4>
          <p className={selectedOption === 'AL' ? 'text-secondary' : 'text-muted'}>Select and explore A/L class options.</p>
        </div>
      </div>

      {/* Conditional Content */}
      {selectedOption === 'OL' && (
        <div className="my-5">
          <h4 className="fw-bold mb-4">O/L Class Grades</h4>
          <div className="row">
            {['10', '11', 'Sonic Team Speed Revision'].map((grade, index) => (
              <div
                className="col-md-4 mb-3"
                key={index}
                onClick={() => handleGradeClick(grade)}
              >
                <div
                  className="card shadow-sm text-center cursor-pointer h-100 d-flex flex-column justify-content-between"
                  style={{
                    borderRadius: '1rem',
                    backgroundColor: selectedGrade === grade ? '#fa541c' : 'white',
                  }}
                >
                  <div className="card-body">
                    <h5 className={`card-title fw-bold ${selectedGrade === grade ? 'text-white' : 'text-dark'}`}>{(grade === '10' || grade === '11') ? `Grade ${grade}` : grade}</h5>
                    <p className={`card-text ${selectedGrade === grade ? 'text-secondary' : 'text-muted'}`}>Explore all resources for {(grade === '10' || grade === '11') ? `Grade ${grade}` : grade}.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedOption === 'AL' && (
        <div className="my-5">
          <h4 className="fw-bold mb-4">A/L Classes</h4>
          <div className="row">
            {['2026', '2027', '2028'].map((grade, index) => (
              <div
                className="col-md-4 mb-3"
                key={index}
                onClick={() => handleGradeClick(grade)}
              >
                <div
                  className="card shadow-sm text-center cursor-pointer"
                  style={{
                    borderRadius: '1rem',
                    backgroundColor: selectedGrade === grade ? '#fa541c' : 'white',
                  }}
                >
                  <div className="card-body">
                    <h5 className={`card-title fw-bold ${selectedGrade === grade ? 'text-white' : 'text-dark'}`}>{grade} A/L</h5>
                    <p className={`card-text ${selectedGrade === grade ? 'text-white' : 'text-muted'}`}>Select and explore all {grade} Class types.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(selectedGrade === '2026' || selectedGrade === '2027' || selectedGrade === '2028') && (
        <div className="my-5">
          <h4 className="fw-bold mb-4">Class Type</h4>
          <div className="row">
            {['theory', 'revision', 'paper'].map((classType, index) => (
              <div
                className="col-md-4 mb-3"
                key={index}
                onClick={() => handleClassTypeClick(classType)}
              >
                <div
                  className="card shadow-sm text-center cursor-pointer"
                  style={{
                    borderRadius: '1rem',
                    backgroundColor: selectedClassType === classType ? '#fa541c' : 'white',
                  }}
                >
                  <div className="card-body">
                    <h5 className={`card-title fw-bold ${selectedClassType === classType ? 'text-white' : 'text-dark'}`}>{classType.charAt(0).toUpperCase() + classType.slice(1)}</h5>
                    <p className={`card-text ${selectedClassType === classType ? 'text-white' : 'text-muted'}`}>Explore all resources for {classType} class.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Section */}
      {(selectedClassType || (selectedGrade ==='10' || selectedGrade === '11' || selectedGrade === 'Sonic Team Speed Revision')) && (
        <div className="mt-5">
          <div className="row text-center mb-5">
            <div className="col-12">
              <h3 className="fw-bolder my-2">Select Lesson Options</h3>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-5">
              <div className="card shadow-sm cursor-pointer h-100 d-flex flex-column justify-content-between" 
                style={{ 
                  borderRadius: '1rem', 
                  backgroundColor: selectedLessonType === 'individual' ? '#fa541c' : 'white',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease', 
                }}
                onClick={() => handleLessonTypeClick('individual')}
                >
                <div className="card-body text-center">
                  {/* <img src={toAbsoluteUrl('/media/static/video.png')} alt="videoImg" width={100} /> */}
                  <h4 className={`card-title fw-bold my-5 ${selectedLessonType === 'individual' ? 'text-white' : 'text-dark'}`}>Individual Lessons</h4>
                  <p className={`card-text mt-4 ${selectedLessonType === 'individual' ? 'text-secondary' : 'text-dark'}`}>Browse and select individual lessons from our collection.</p>
                  {/* <a href={`single-videos/?selectedGrade=${selectedGrade}`} className='btn btn-md btn-dark mt-5'>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                    Browse
                  </a> */}
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-5">
              <div className="card shadow-sm cursor-pointer h-100 d-flex flex-column justify-content-between" 
                style={{ 
                  borderRadius: '1rem', 
                  backgroundColor: selectedLessonType === 'package' ? '#fa541c' : 'white',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease', 
                }}
                onClick={() => handleLessonTypeClick('package')}
                >
                <div className={`card-body text-center ${selectedLessonType === 'package' ? 'text-white' : 'text-dark'}`}>
                  {/* <img src={toAbsoluteUrl('/media/static/videos.png')} alt="videoImg" width={100} /> */}
                  <h4 className={`card-title fw-bold my-5 ${selectedLessonType === 'package' ? 'text-white' : 'text-dark'}`}>Lessons Packages</h4>
                  <p className={`card-text mt-4 ${selectedLessonType === 'package' ? 'text-secondary' : 'text-dark'}`}>Explore our curated lessons packages for your needs.</p>
                  {/* <a href={`package-videos/?selectedGrade=${selectedGrade}`} className='btn btn-md btn-dark mt-5'>
                    <KTSVG path='/media/icons/duotune/arrows/arr071.svg' className='svg-icon-3' />
                    Browse
                  </a> */}
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-5">
              <div className="card shadow-sm cursor-pointer h-100 d-flex flex-column justify-content-between" 
                style={{ 
                  borderRadius: '1rem', 
                  backgroundColor: selectedLessonType === 'tutes' ? '#fa541c' : 'white',
                  transform: 'scale(1)',
                  transition: 'all 0.3s ease', 
                }}
                onClick={() => handleLessonTypeClick('tutes')}
                >
                <div className="card-body text-center">
                  {/* <img src={toAbsoluteUrl('/media/static/video.png')} alt="videoImg" width={100} /> */}
                  <h4 className={`card-title fw-bold my-5 ${selectedLessonType === 'tutes' ? 'text-white' : 'text-dark'}`}>Tutes</h4>
                  <p className={`card-text mt-4 ${selectedLessonType === 'tutes' ? 'text-secondary' : 'text-dark'}`}>Browse and select tutes from our collection.</p>
                  {/* <a href={`single-videos/?selectedGrade=${selectedGrade}`} className='btn btn-md btn-dark mt-5'>
                    <KTSVG path='/media/icons/duotune/arrows/arr075.svg' className='svg-icon-3' />
                    Browse
                  </a> */}
                </div>
              </div>
            </div>
          </div>
          {selectedLessonType && (
            <div className="row">
              {selectedClassType ? (
                <div className="col-md-6 mb-5">
                  <a href={`${selectedLessonType}-lessons/?selectedGrade=${selectedGrade}&selectedClassType=${selectedClassType}`} className='btn btn-md btn-dark mt-5'>
                    Browse
                    <SVG src={toAbsoluteUrl('/media/icons/duotune/arrows/arr071.svg')} className='mh-50px' />
                  </a>
                </div>
              ) : (
                <div className="col-md-6 mb-5">
                  <a href={`${selectedLessonType}-lessons/?selectedGrade=${selectedGrade}`} className='btn btn-md btn-dark mt-5'>
                    Browse
                    <SVG src={toAbsoluteUrl('/media/icons/duotune/arrows/arr071.svg')} className='mh-50px' />
                  </a>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </KTCardBody>
  )
}

export { LessonTabs }
