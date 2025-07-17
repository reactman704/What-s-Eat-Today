import { useEffect, useState } from 'react'
import axios from 'axios'
import { Wheel } from 'react-custom-roulette'

interface MenuItem {
  id: number
  name_kr: string
  name_en: string
  category: string
}

function App() {
  const [foods, setFoods] = useState<MenuItem[]>([])
  const [foodCategory, setFoodCategory] = useState<string[]>([])

  const [rouletteFoods, setRouletteFoods] = useState<MenuItem[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // 룰렛 상태
  const [mustSpin, setMustSpin] = useState(false)
  const [prizeNumber, setPrizeNumber] = useState(0)
  const [selectedFood, setSelectedFood] = useState<MenuItem | null>(null)

  useEffect(() => {
    async function FetchData() {
      try {
        const url =
          'https://gist.githubusercontent.com/reactman704/2eb9c93bc940a47bae76eecb9834e347/raw/07afe9705a88cd9e59dbf6aced7c1bb21291b394/WhatsEatToday.json'

        const response = await axios.get<MenuItem[]>(url)

        setFoods(response.data)

        const categories = Array.from(
          new Set(response.data.map((food) => food.category))
        )
        setFoodCategory(categories)
      } catch (error) {
        console.error(error)
      }
    }

    FetchData()
  }, [])

  // 카테고리 선택/해제
  const onCategorySelect = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories((prev) => prev.filter((cat) => cat !== category))
      setRouletteFoods((prev) =>
        prev.filter((food) => food.category !== category)
      )
    } else {
      setSelectedCategories((prev) => [...prev, category])
      const newFoods = foods.filter((food) => food.category === category)

      setRouletteFoods((prev) => {
        const existingIds = new Set(prev.map((f) => f.id))
        const filteredNewFoods = newFoods.filter((f) => !existingIds.has(f.id))
        return [...prev, ...filteredNewFoods]
      })
    }
  }

  // 룰렛에 들어가는 데이터 형식으로 변환
  const wheelData =
    rouletteFoods.length > 0
      ? rouletteFoods.map((food) => ({ option: food.name_kr }))
      : [{ option: '음식을 선택하세요' }] // 빈 배열일 때 기본값

  // 룰렛 돌리기
  const spinRoulette = () => {
    if (rouletteFoods.length === 0) {
      alert('카테고리를 골라주세요!')
      return
    }

    // 여기서 당첨 인덱스 고정하거나 랜덤으로 설정 가능
    const randomIndex = Math.floor(Math.random() * rouletteFoods.length)
    setPrizeNumber(randomIndex)
    setMustSpin(true)
  }

  return (
    <>
      {/* 카테고리 선택 버튼 */}
      <div className="flex gap-4 p-6 flex-wrap justify-center">
        {foodCategory.map((cate) => (
          <button
            key={cate}
            onClick={() => onCategorySelect(cate)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '2px solid #666',
              backgroundColor: selectedCategories.includes(cate)
                ? '#4F46E5'
                : 'white',
              color: selectedCategories.includes(cate) ? 'white' : '#333',
              cursor: 'pointer',
              transition: 'background-color 0.3s, color 0.3s',
              boxShadow: selectedCategories.includes(cate)
                ? '0 0 10px #4F46E5'
                : 'none',
            }}
          >
            {cate}
          </button>
        ))}
      </div>

      

      {/* 당첨 결과 보여주기 */}
      {selectedFood && (
        <div
          style={{
            marginTop: 30,
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            color: '#4F46E5',
          }}
        >
          🎉 당첨된 음식: {selectedFood.name_kr} 🎉
        </div>
      )}

      <div className='flex justify-center items-center py-[6rem]'>
        {/* 룰렛 & 12시 핀 */}
        <div
          style={{ transform: 'rotate(316deg)' }}
        >
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={wheelData}
            onStopSpinning={() => {
              setMustSpin(false)
              setSelectedFood(rouletteFoods[prizeNumber])
              alert(`당첨! ${rouletteFoods[prizeNumber].name_kr}`)
            }}
            backgroundColors={['#3e3e3e', '#df3428']}
            textColors={['#ffffff']}
            outerBorderColor="#000000"
            outerBorderWidth={5}
            innerBorderColor="#000000"
            innerBorderWidth={5}
            radiusLineColor="#ffffff"
            radiusLineWidth={2}
            fontSize={16}
            textDistance={60}
          />



        </div>
      </div>


      {/* 룰렛 돌리기 버튼 */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <button
          onClick={spinRoulette}
          disabled={mustSpin}
          style={{
            padding: '12px 24px',
            fontSize: 18,
            borderRadius: '8px',
            backgroundColor: mustSpin ? '#a0a0a0' : '#4F46E5',
            color: 'white',
            border: 'none',
            cursor: mustSpin ? 'not-allowed' : 'pointer',
            boxShadow: '0 0 10px #4F46E5',
            transition: 'background-color 0.3s',
          }}
        >
          룰렛 돌리기
        </button>
      </div>



    </>
  )
}

export default App
