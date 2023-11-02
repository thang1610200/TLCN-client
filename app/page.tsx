


export default function Home() {
  return (
    <main>
      <div className="absolute w-full h-full bg-slate-200">
        <div
          className="relative w-[100px] h-[90px] mt-[25%] mx-auto mb-0 animate-ping
      before:content-[''] before:absolute before:w-[50px] before:h-[80px] before:bg-red-600  before:rounded-full before:rounded-br-none before:-rotate-45 before:origin-bottom-left before:left-[50px] before:top-0
      after:content-[''] after:absolute after:w-[50px] after:h-[80px] after:bg-red-600  after:rounded-full after:rounded-br-none after:rotate-45 after:origin-bottom-right after:left-0 after:top-0"
        ></div>
      </div>
    </main>
  );
}
