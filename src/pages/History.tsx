import PATH from '@/utils/path'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import imgError from '@/assets/img/img-error.png'
import { HistoryComic, historyDeleteComic, historyDeleteComics } from '@/utils/history'

const History = () => {
  const [dataComics, setDataComics] = useState([])

  useEffect(() => {
    const db = window.db
    const trans = db.transaction('history', 'readwrite')
    const store = trans.objectStore('history')
    const cursorRequest = store.index('reading_at').openCursor(null, 'prevunique')
    const response: any = []
    cursorRequest.onsuccess = () => {
      const cursor = cursorRequest.result
      if (cursor) {
        response.push(cursor.value)
        cursor.continue()
      } else {
        setDataComics(response)
      }
    }
  }, [window.db.transaction('history', 'readwrite').objectStore('history')])

  return (
    <div className='container'>
      <div className='mt-6 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Link to={PATH.home} className='flex items-center gap-1 hover:text-primary text-lg'>
            Trang chủ{' '}
            <svg
              xmlns='http://www.w3.org/2000/svg'
              xmlnsXlink='http://www.w3.org/1999/xlink'
              aria-hidden='true'
              className='w-5 h-5'
              viewBox='0 0 48 48'
            >
              <path
                fill='none'
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={3}
                d='M19 12L31 24L19 36'
              />
            </svg>
          </Link>
          <span className='flex items-center gap-1 text-lg'>Lịch sử</span>
        </div>
        <div className='flex items-center'>
          <button
            onClick={() => historyDeleteComics()}
            className='active:scale-90 border hover:border-primary hover:text-primary px-2 py-1 rounded-md'
          >
            Xóa tất cả
          </button>
        </div>
      </div>
      <div className='mt-8 min-h-[550px]'>
        {dataComics && dataComics.length > 0 && (
          <div className={`grid grid-cols-12 gap-6`}>
            {(dataComics as HistoryComic[]).map((item) => (
              <div key={item.id} className='col-span-6 hover:bg-[rgba(0,0,0,0.04)] p-4 rounded-lg'>
                <div className='flex'>
                  <Link
                    to={`${PATH.comics}/${item.id}`}
                    title={item.title}
                    className='flex-shrink-0'
                  >
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      title={item.title}
                      loading='lazy'
                      className='w-[165px] h-[220px] object-cover'
                      onError={({ currentTarget }) => {
                        currentTarget.onerror = null
                        currentTarget.src = imgError
                      }}
                    />
                  </Link>
                  <div className='pl-[15px] pr-2 leading-5 flex flex-col flex-1'>
                    <Link
                      to={`${PATH.comics}/${item.id}`}
                      className='text-black hover:text-primary text-lg font-bold leading-5 line-clamp-1 mt-3'
                      title={item.title}
                    >
                      {item.title}
                    </Link>
                    <span className='text-sm mt-1'>{item.reading_at}</span>
                    <p className='inline-block mt-4'>
                      <span className='mr-1'>Đang đọc:</span>
                      <Link
                        to={`${PATH.chapters}/${item.id}/${item.chapter_id}`}
                        title={item.last_reading}
                        className='text-primary'
                      >
                        {item.last_reading}
                      </Link>
                    </p>
                    <p className='line-clamp-3 mt-3'>{item.description}</p>
                    <div className='flex items-center gap-3 mt-auto'>
                      <Link
                        title={item.last_reading}
                        to={`${PATH.chapters}/${item.id}/${item.chapter_id}`}
                        className='rounded-md w-full h-9 flex items-center justify-center border border-black/20 hover:border-[#4b8fd7] hover:text-[#4b8fd7] active:scale-90'
                      >
                        Đọc tiếp
                      </Link>
                      <button
                        onClick={() => historyDeleteComic(item.id)}
                        className='rounded-md w-full h-9 flex items-center justify-center border border-black/20 hover:border-primary hover:text-primary active:scale-90'
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {Array.isArray(dataComics) && !dataComics.length && (
          <h3 className='flex items-center justify-center text-2xl h-[550px]'>
            Không tìm thấy lịch sử
          </h3>
        )}
      </div>
    </div>
  )
}

export default History
