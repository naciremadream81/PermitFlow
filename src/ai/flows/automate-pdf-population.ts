'use server';

/**
 * @fileOverview Automates the population of PDF forms with relevant data.
 *
 * - automatePdfPopulation - A function that automates PDF population.
 * - AutomatePdfPopulationInput - The input type for the automatePdfPopulation function.
 * - AutomatePdfPopulationOutput - The return type for the automatePdfPopulation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutomatePdfPopulationInputSchema = z.object({
  customerData: z.record(z.any()).describe('Customer data to populate the PDF form.'),
  contractorData: z.record(z.any()).describe('Contractor data to populate the PDF form.'),
  propertyData: z.record(z.any()).describe('Property data to populate the PDF form.'),
  permitData: z.record(z.any()).describe('Permit data to populate the PDF form.'),
  pdfTemplateDataUri: z
    .string()
    .describe(
      'The PDF template to populate, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type AutomatePdfPopulationInput = z.infer<typeof AutomatePdfPopulationInputSchema>;

const AutomatePdfPopulationOutputSchema = z.object({
  extractedData: z.record(z.any()).describe('The extracted and structured data ready for PDF population.'),
  // NOTE: In a real implementation, this would be the URI of the *filled* PDF.
  // We are leaving it here to show what a full implementation would include.
  populatedPdfDataUri: z.string().optional().describe('The populated PDF form as a data URI.'),
});
export type AutomatePdfPopulationOutput = z.infer<typeof AutomatePdfPopulationOutputSchema>;

export async function automatePdfPopulation(input: AutomatePdfPopulationInput): Promise<AutomatePdfPopulationOutput> {
  return automatePdfPopulationFlow(input);
}

const prompt = ai.definePrompt({
    name: 'extractPdfDataPrompt',
    input: { schema: AutomatePdfPopulationInputSchema },
    output: { schema: z.object({ extractedData: z.record(z.any()) }) },
    prompt: `You are an expert data processor for a construction permit company. Your task is to extract and structure data from the provided JSON objects to prepare it for filling a PDF form.

Analyze the following data:
- Customer Data: {{{json customerData}}}
- Contractor Data: {{{json contractorData}}}
- Property Data: {{{json propertyData}}}
- Permit Data: {{{json permitData}}}

Extract the key information and structure it into a simple key-value JSON object. Use clear and simple keys. For example: "customerName", "contractorLicenseNumber", "propertyAddress", "permitId". Combine address parts into a single string.

Return only the JSON object containing the extracted data.`,
});


const automatePdfPopulationFlow = ai.defineFlow(
  {
    name: 'automatePdfPopulationFlow',
    inputSchema: AutomatePdfPopulationInputSchema,
    outputSchema: AutomatePdfPopulationOutputSchema,
  },
  async (input) => {
    
    const { output } = await prompt(input);
    if (!output) {
      throw new Error("AI failed to extract data.");
    }

    // In a real implementation, you would use a library like 'pdf-lib'
    // to take `output.extractedData` and programmatically fill the PDF fields
    // located at `input.pdfTemplateDataUri`.
    // For now, we will return the extracted data and the original PDF URI
    // to demonstrate the data extraction part of the flow.
    return {
      extractedData: output.extractedData,
      populatedPdfDataUri: input.pdfTemplateDataUri, // Returning original for demonstration
    };
  }
);
