'use client'

import { useState, useEffect } from 'react'
import { Search, Calendar, Eye, Sparkles, Building2, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MarkdownViewer } from '@/components/markdown-viewer'

const API_BASE = 'https://80.225.232.134:8002'

interface Article {
image_name: string
headline: string
full_text: string
article_date: string
}

interface Department {
departments: string[]
}

interface Category {
categories: string[]
}

interface Keywords {
keywords: string[]
}

export default function AMCMediaSearch() {
const [searchTerm, setSearchTerm] = useState('')
const [articles, setArticles] = useState<Article[]>([])
const [departments, setDepartments] = useState<string[]>([])
const [categories, setCategories] = useState<string[]>([])
const [selectedDepartment, setSelectedDepartment] = useState('')
const [selectedCategory, setSelectedCategory] = useState('')
const [departmentKeywords, setDepartmentKeywords] = useState<string[]>([])
const [categoryKeywords, setCategoryKeywords] = useState<string[]>([])
const [loading, setLoading] = useState(false)
const [analyzing, setAnalyzing] = useState(false)
const [analysis, setAnalysis] = useState('')
const [error, setError] = useState('')

// Fetch departments and categories on mount
useEffect(() => {
const fetchInitialData = async () => {
try {
  const [deptResponse, catResponse] = await Promise.all([
    fetch(`${API_BASE}/departments`),
    fetch(`${API_BASE}/categories`)
  ])
  
  if (deptResponse.ok && catResponse.ok) {
    const deptData: Department = await deptResponse.json()
    const catData: Category = await catResponse.json()
    setDepartments(deptData.departments)
    setCategories(catData.categories)
  }
} catch (err) {
  setError('Failed to load initial data')
}
}

fetchInitialData()
}, [])

// Fetch keywords when department is selected
useEffect(() => {
if (selectedDepartment) {
fetchKeywords(0, selectedDepartment, setDepartmentKeywords)
}
}, [selectedDepartment])

// Fetch keywords when category is selected
useEffect(() => {
if (selectedCategory) {
fetchKeywords(1, selectedCategory, setCategoryKeywords)
}
}, [selectedCategory])

const fetchKeywords = async (type: number, name: string, setter: (keywords: string[]) => void) => {
try {
const response = await fetch(`${API_BASE}/keywords/?type=${type}&name=${encodeURIComponent(name)}`)
if (response.ok) {
  const data: Keywords = await response.json()
  setter(data.keywords)
}
} catch (err) {
console.error('Failed to fetch keywords:', err)
}
}

const handleSearch = async (keyword: string = searchTerm) => {
if (!keyword.trim()) return

setLoading(true)
setError('')

try {
const response = await fetch(`${API_BASE}/search/?keyword=${encodeURIComponent(keyword)}`)
if (response.ok) {
  const data: Article[] = await response.json()
  setArticles(data)
} else {
  setError('Search failed. Please try again.')
}
} catch (err) {
setError('Network error. Please check your connection.')
} finally {
setLoading(false)
}
}

function handleAnalyze(article: Article) {
setAnalyzing(true)
setAnalysis('')

;(async () => {
  try {
    const response = await fetch(`${API_BASE}/analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        headline: article.headline,
        full_text: article.full_text,
        keyword: searchTerm,
        image_name: article.image_name,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      setAnalysis(data.analysis)
    } else {
      setError('Analysis failed. Please try again.')
    }
  } catch (err) {
    setError('Failed to analyze article.')
  } finally {
    setAnalyzing(false)
  }
})()
}

const formatDate = (dateString: string) => {
return new Date(dateString).toLocaleDateString('en-IN', {
year: 'numeric',
month: 'long',
day: 'numeric'
})
}

return (
<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
{/* Header */}
<div className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div className="flex items-center space-x-4">
      <div className="flex items-center space-x-5">
        <div
          className="relative flex items-center justify-center w-12 h-12 rounded-full bg-white ring-2 ring-gray-200 shadow-sm overflow-hidden"
          aria-label="CMO logo"
        >
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/download-ApwJEb3Hn2JKXJhPJY0LteYClnkUaS.webp"
            alt="CMO logo"
            className="w-[86%] h-[86%] object-contain"
            decoding="async"
            loading="eager"
          />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CMO Media Search</h1>
          <p className="text-sm text-gray-600">CMO News Portal</p>
        </div>
      </div>
    </div>
  </div>
</div>

<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Search Section */}
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Search className="w-5 h-5" />
        <span>Search News Articles</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Main Search */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <Input
            placeholder="Search for news articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="text-lg"
          />
        </div>
        <Button 
          onClick={() => handleSearch()} 
          disabled={loading}
          className="px-8"
        >
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {/* Filters */}
      <Tabs defaultValue="departments" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="departments" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>Departments</span>
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center space-x-2">
            <Tag className="w-4 h-4" />
            <span>Categories</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Department
              </label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {departmentKeywords.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department Keywords
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {departmentKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer hover:bg-blue-100"
                      onClick={() => handleSearch(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {categoryKeywords.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Keywords
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {categoryKeywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      className="cursor-pointer hover:bg-orange-100"
                      onClick={() => handleSearch(keyword)}
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>

  {/* Error Alert */}
  {error && (
    <Alert className="mb-6 border-red-200 bg-red-50">
      <AlertDescription className="text-red-800">{error}</AlertDescription>
    </Alert>
  )}

  {/* Results */}
  {loading ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  ) : articles.length > 0 ? (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Search Results ({articles.length} articles found)
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-0">
              {/* Image */}
              <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                <img
                  src={`${API_BASE}/image/${article.image_name}`}
                  alt={article.headline}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/abstract-geometric-shapes.png'
                  }}
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-white/90">
                    <Calendar className="w-3 h-3 mr-1" />
                    {formatDate(article.article_date)}
                  </Badge>
                </div>
              </div>
              
              {/* Content */}
              
<div className="p-4">
<h3 className="font-semibold text-gray-900 mb-4 line-clamp-2">
{article.headline}
</h3>
<div className="flex space-x-2">
{/* View dialog with full text */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline" size="sm" className="flex-1">
      <Eye className="w-4 h-4 mr-1" />
      View
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>{article.headline}</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <img
        src={`${API_BASE}/image/${article.image_name}`}
        alt={article.headline}
        className="w-full max-h-96 object-contain rounded-lg"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = '/abstract-geometric-shapes.png'
        }}
      />
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>{formatDate(article.article_date)}</span>
      </div>
      {/* Full text shown only in the View modal */}
      <div className="prose max-w-none">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {article.full_text}
        </p>
      </div>
    </div>
  </DialogContent>
</Dialog>

<Dialog>
  <DialogTrigger asChild>
    <Button
      size="sm"
      variant="default"
      className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2"
      onClick={() => handleAnalyze(article)}
      aria-label="Analyze article"
    >
      <Sparkles className="w-4 h-4 mr-1 text-white" />
      Analyze
    </Button>
  </DialogTrigger>
  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>AI Analysis</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      {analyzing ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <span className="ml-2">Analyzing article...</span>
        </div>
      ) : (
        <div className="bg-white p-0 rounded-lg">
          <MarkdownViewer content={analysis} />
        </div>
      ) ? (
        <div className="prose max-w-none">
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap text-sm text-gray-700">
              {analysis}
            </pre>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Click analyze to get AI insights on this article.</p>
      )}
    </div>
  </DialogContent>
</Dialog>
</div>
</div>

            </CardContent>
          </Card>
        ))}
      </div>
    </>
  ) : searchTerm && !loading ? (
    <div className="text-center py-12">
      <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <Search className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
      <p className="text-gray-600">Try searching with different keywords or browse by department/category.</p>
    </div>
  ) : null}
</div>
</div>
)
}
