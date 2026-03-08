"use client"

import axios from "axios"
import { useState } from "react"

export default function Home(){

const [file,setFile] = useState<File | null>(null)
const [jd,setJD] = useState("")
const [result,setResult] = useState<any>(null)
const [loading,setLoading] = useState(false)

const handleUpload = async () => {

if(!file){
alert("Upload Resume First!")
return
}

setLoading(true)

try{

const formData = new FormData()
formData.append("resume",file)
formData.append("job_description",jd)

const res = await axios.post(
"http://127.0.0.1:8000/analyze-pdf",
formData
)

setResult(res.data)

}catch(err){
alert("Error analyzing resume")
}

setLoading(false)
}

const formatFeedback = (text:string) => {

let formatted:any = {}

const matched = text.match(/\[MATCHED SKILLS\]([\s\S]*?)\[MISSING SKILLS\]/)
const missing = text.match(/\[MISSING SKILLS\]([\s\S]*?)\[SUGGESTED PROJECTS\]/)
const projects = text.match(/\[SUGGESTED PROJECTS\]([\s\S]*?)\[TAILORED PROFESSIONAL SUMMARY\]/)
const summary = text.match(/\[TAILORED PROFESSIONAL SUMMARY\]([\s\S]*?)\[ACTION PLAN\]/)
const action = text.match(/\[ACTION PLAN\]([\s\S]*)/)

if(matched) formatted["MATCHED"] = matched[1]
if(missing) formatted["MISSING"] = missing[1]
if(projects) formatted["PROJECTS"] = projects[1]
if(summary) formatted["SUMMARY"] = summary[1]
if(action) formatted["ACTION"] = action[1]

return formatted
}

return(

<div className="min-h-screen bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 flex items-center justify-center p-8">

<div className="w-full max-w-6xl">

<h1 className="text-4xl font-bold text-white text-center mb-8">
AI Resume Analyzer Dashboard
</h1>

{/* Upload Section */}
<div className="backdrop-blur-lg bg-white/10 border border-white/20 p-6 rounded-2xl shadow-xl mb-8">

<label className="bg-white text-blue-700 px-4 py-2 rounded-lg cursor-pointer font-semibold shadow hover:scale-105 transition">
Upload Resume
<input
type="file"
hidden
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>
</label>

{file && (
<p className="mt-2 text-blue-100 text-sm">
Selected File: {file.name}
</p>
)}

<textarea
className="w-full border border-white/30 bg-white/20 text-white placeholder:text-blue-200 p-3 mt-4 rounded-lg outline-none"
rows={4}
placeholder="Paste Job Description..."
onChange={(e)=>setJD(e.target.value)}
/>

<button
onClick={handleUpload}
className="mt-4 w-full bg-white text-blue-700 font-semibold py-2 rounded-lg hover:bg-blue-100 transition"
>
Analyze Resume
</button>

</div>

{/* Loader */}
{loading && (
<div className="text-center text-white text-lg animate-pulse">
Analyzing Resume...
</div>
)}

{/* Results */}
{result && (()=>{

const feedback = formatFeedback(result[1])

return(

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">

<div className="col-span-2 bg-white text-center p-6 rounded-xl shadow-lg">
<h2 className="text-2xl font-bold text-blue-700">
ATS Score: {result[0].match_percentage}%
</h2>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<h3 className="text-green-600 font-semibold mb-2">
Matched Skills
</h3>
<p className="text-gray-700 whitespace-pre-line">
{feedback["MATCHED"]}
</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<h3 className="text-red-600 font-semibold mb-2">
Missing Skills
</h3>
<p className="text-gray-700 whitespace-pre-line">
{feedback["MISSING"]}
</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<h3 className="text-blue-600 font-semibold mb-2">
Suggested Projects
</h3>
<p className="text-gray-700 whitespace-pre-line">
{feedback["PROJECTS"]}
</p>
</div>

<div className="bg-white p-4 rounded-xl shadow">
<h3 className="text-gray-700 font-semibold mb-2">
Professional Summary
</h3>
<p className="text-gray-700 whitespace-pre-line">
{feedback["SUMMARY"]}
</p>
</div>

<div className="col-span-2 bg-white p-4 rounded-xl shadow">
<h3 className="text-gray-700 font-semibold mb-2">
Action Plan
</h3>
<p className="text-gray-700 whitespace-pre-line">
{feedback["ACTION"]}
</p>
</div>

</div>

)
})()}

</div>
</div>
)
}