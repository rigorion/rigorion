// services/questionService.ts
import { supabase } from '@/lib/supabase'
import { Question } from '@/types/QuestionInterface'

export const fetchQuestions = async (
  page: number,
  perPage: number,
  difficulty?: string,
  chapter?: string
) => {
  try {
    let query = supabase
      .from('questions')
      .select('*')
      .range((page - 1) * perPage, page * perPage - 1)
      .order('created_at', { ascending: false })

    if (difficulty) query = query.eq('difficulty', difficulty)
    if (chapter) query = query.eq('chapter', chapter)

    const { data, error, count } = await query

    if (error) throw error
    return { data: data as Question[], count: count || 0 }
  } catch (error) {
    console.error('Error fetching questions:', error)
    throw error
  }
}

export const fetchQuestionById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data as Question
  } catch (error) {
    console.error('Error fetching question:', error)
    throw error
  }
}