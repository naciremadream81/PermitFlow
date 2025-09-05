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
  populatedPdfDataUri: z.string().describe('The populated PDF form as a data URI.'),
});
export type AutomatePdfPopulationOutput = z.infer<typeof AutomatePdfPopulationOutputSchema>;

export async function automatePdfPopulation(input: AutomatePdfPopulationInput): Promise<AutomatePdfPopulationOutput> {
  return automatePdfPopulationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatePdfPopulationPrompt',
  input: {schema: AutomatePdfPopulationInputSchema},
  output: {schema: AutomatePdfPopulationOutputSchema},
  prompt: `You are an AI assistant designed to populate PDF forms with provided data.

You will receive customer, contractor, property, and permit data, as well as a PDF template.

Your task is to analyze the data and populate the PDF template accurately.

Return the populated PDF form as a data URI.

Customer Data: {{{customerData}}}
Contractor Data: {{{contractorData}}}
Property Data: {{{propertyData}}}
Permit Data: {{{permitData}}}
PDF Template: {{media url=pdfTemplateDataUri}}

Ensure that all relevant fields in the PDF are filled with the correct information.
`,
});

const automatePdfPopulationFlow = ai.defineFlow(
  {
    name: 'automatePdfPopulationFlow',
    inputSchema: AutomatePdfPopulationInputSchema,
    outputSchema: AutomatePdfPopulationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
