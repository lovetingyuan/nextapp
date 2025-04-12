import { z } from 'zod'
import { formSchema } from './SongForm'
export type FormValueType = z.infer<typeof formSchema>
