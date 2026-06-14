import { blink } from '@/lib/blink';

const COLLECTION_NAME = 'chelsea-intelligence';

export const initializeRAG = async () => {
  try {
    // Attempt to create collection
    await blink.rag.createCollection({
      name: COLLECTION_NAME,
      description: "Chelsea's core knowledge base and master directives."
    });
    console.log('RAG: Collection initialized');
  } catch (error: any) {
    if (error?.message?.includes('409') || error?.message?.includes('already exists')) {
      console.log('RAG: Collection already exists');
    } else {
      console.error('RAG Initialization Error:', error);
    }
  }
};

export const searchIntelligence = async (query: string) => {
  try {
    const result = await blink.rag.aiSearch({
      collectionName: COLLECTION_NAME,
      query,
      model: 'google/gemini-3-flash'
    });
    return result;
  } catch (error) {
    console.error('RAG Search Error:', error);
    return null;
  }
};

export const ingestDirectives = async (content: string, filename: string) => {
  try {
    const doc = await blink.rag.upload({
      collectionName: COLLECTION_NAME,
      filename,
      content
    });
    await blink.rag.waitForReady(doc.id);
    return doc;
  } catch (error) {
    console.error('RAG Ingestion Error:', error);
    return null;
  }
};
