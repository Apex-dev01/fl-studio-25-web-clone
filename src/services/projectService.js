import { supabase } from '../supabaseClient'

export const saveProject = async (userId, projectData) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .upsert({
        user_id: userId,
        project_data: projectData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
      .select()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const loadProject = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const getUserProjects = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    
    if (error) throw error
    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}
