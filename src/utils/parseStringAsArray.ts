export default function parseStringAsArray(arrayAsString: string | undefined): string[] {
    if (!arrayAsString) {
      return [];
    }
  
    return arrayAsString.split(',').map(tech => tech.trim().toLowerCase());
  }
  