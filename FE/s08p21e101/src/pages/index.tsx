import styles from "@/styles/Home.module.scss";
import Head from "next/head";
import AppLayout from "@/components/layout/AppLayout";

export default function Home() {
  return (
    <AppLayout home>
      <Head>
        <title>특화 프로젝트 프론트 메인</title>
        <meta name='description' content='특화 프로젝트' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        안뇽하세요
        <h1 className='text-3xl font-bold underline decoration-sky-500'>Hello world!</h1>
        <button className='rounded-full bg-blue-500 rounded-2xl' type='button'>
          Save Changes
        </button>
        <input type='text' className='rounded py-1 text-pink-500' />
        <input type='text' className='rounded py-1 text-pink-500 w-full' />
        <p>
          I’m Derek, an astro-engineer based in Tattooine. I like to build X-Wings at
          <a className='underline decoration-sky-500'>My Company, Inc</a>. Outside of work, I like to{" "}
          <a className='underline decoration-pink-500'>watch pod-racing</a> and have <a className='underline decoration-indigo-500'>light-saber</a>{" "}
          fights.
        </p>
        <div className='bg-slate-400 py-20 px-10 grid gap-10 min-h-screen'>
          <div className='bg-white p-10 rounded-3xl shadow-xl'>
            <span className='font-bold text-2xl'>Select Item</span>
            <div className='flex justify-between my-2'>
              <span className='text-gray-500'>Gray Chair</span>
              <span className='font-bold'>$19</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-500'>Gray Chair</span>
              <span className='font-bold'>$19</span>
            </div>
            <div className='flex justify-between mt-2 pt-2 border-t-2 border-dashed font-bold'>
              <span>Total</span>
              <span>$38</span>
            </div>
            <button
              className='flex justify-center w-2/4 mt-5 mx-auto bg-blue-500
              rounded-2xl p-2 text-white drop-shadow-md
              hover:bg-blue-400  active:bg-teal-500  disabled:bg-blue-200'
              type='button'>
              Checkout
            </button>
          </div>
        </div>
      </main>
    </AppLayout>
  );
}
