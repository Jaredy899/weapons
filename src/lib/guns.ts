import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function for merging class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Gun data interface
export interface Gun {
  id: string
  manufacturer: string
  model: string
  caliber: string
  serialNumber: string
  imageUrl?: string
  isArchived: boolean
  archiveNotes?: string
}

// Function to parse CSV data into Gun objects
function parseGunsFromCSV(csvContent: string): Gun[] {
  const lines = csvContent.split('\n').filter(line => line.trim() !== '')
  
  return lines.slice(1).map(line => {
    const values = line.split(',')
    // Ensure we have at least 7 values
    if (values.length < 7) {
      console.warn('Invalid line in CSV:', line)
      return null
    }

    const gun: Gun = {
      id: `${values[0]}-${values[1]}-${values[3]}`.replace(/\s+/g, '-'),
      manufacturer: values[0].trim(), // First column is manufacturer
      model: values[1].trim(), // Second column is model
      caliber: values[2].trim(), // Third column is caliber
      serialNumber: values[3].trim(), // Fourth column is serial number
      imageUrl: values[4]?.trim() || undefined, // Fifth column is image URL
      isArchived: values[5]?.trim().toLowerCase() === 'true', // Sixth column is isArchived
      archiveNotes: values[6]?.trim() || undefined // Seventh column is archive notes
    }
    return gun
  }).filter((gun): gun is Gun => gun !== null)
}

// Function to load guns from CSV
export async function loadGunsFromCSV(): Promise<Gun[]> {
  try {
    const csvUrl = import.meta.env.VITE_GUNS_CSV_URL
    if (!csvUrl) {
      throw new Error('Missing VITE_GUNS_CSV_URL environment variable')
    }

    const response = await fetch(csvUrl)
    if (!response.ok) {
      throw new Error('Failed to fetch CSV data')
    }
    const csvContent = await response.text()
    return parseGunsFromCSV(csvContent)
  } catch (error) {
    console.error('Error loading guns from CSV:', error)
    return []
  }
} 