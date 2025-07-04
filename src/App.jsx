import React from 'react'
import NavBar from './sections/NavBar'
import Hero from './sections/Hero'
import About from './sections/About'
import Projects from './sections/Projects'
import Contact from './sections/Contact'
import Footer from './sections/Footer'
import WorkExperience from './sections/Experience'

const App = () => {
  return (
    <main className="max-w-7xl mx-auto relative">
      <NavBar />
      <Hero />
      <About />
      <Projects />
      <WorkExperience/>
      <Contact />
      <Footer />
    </main>
  )
}

export default App