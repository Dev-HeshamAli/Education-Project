import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const testimonials = [
  {
    name: 'أحمد المصري',
    role: 'ولي أمر طالب',
    text: 'لم أكن أتخيل أن يجد ابني بديلاً للمدرسة بهذا المستوى من الجودة...',
    img: '/assets/img/client/client-1.jpg',
  },
  {
    name: 'فاطمة علي',
    role: 'ولية أمر طالبة',
    text: 'ابنتي تحب الدراسة الآن بفضلكم...',
    img: '/assets/img/client/client-2.jpg',
  },
  {
    name: 'محمد عبدالله',
    role: 'ولي أمر طالب',
    text: 'منصة منظمة جدًا...',
    img: '/assets/img/client/client-3.jpg',
  },
]

export default function Testimonials() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-indigo-600 text-lg font-semibold">آراء أولياء الأمور</span>
          <h2 className="text-3xl font-bold mt-2">ماذا يقولون عنا؟</h2>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          className="w-full max-w-3xl mx-auto"
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-xl shadow-md text-right">
                <p className="text-gray-700 text-lg mb-6">{item.text}</p>
                <div className="flex items-center justify-end">
                  <div className="ml-4">
                    <h4 className="font-semibold text-lg">{item.name}</h4>
                    <span className="text-sm text-gray-500">{item.role}</span>
                  </div>
                  <img src={item.img} alt={item.name} className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover" />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
