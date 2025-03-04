import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next'; 
import { authOptions } from '@/auth/[...nextauth]'; 
import axios from 'utils/axios'; 
import { AuthInfo } from 'types/auth';
import { getSessionAuthInfo } from 'utils/database'; 
import { Formidable } from 'formidable';
import { promises as fs } from 'fs';


export const config = {
  api: {
    bodyParser: false, // Disable body parser to handle FormData
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log("i am coming");
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    let headers: any = {};

    const session = await getServerSession(req, res, authOptions);
    if (session) {
      const authInfo: AuthInfo = await getSessionAuthInfo(session.sessionId);
      headers = {
        Authorization: `Bearer ${authInfo.accessToken}`
      };
    }

    const parseForm = async (req: NextApiRequest): Promise<{ fields: any; files: any }> => {
      const form = new Formidable({ 
        multiples: false, 
        keepExtensions: true, 
      });
  
      return new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          else resolve({ fields, files });
        });
      });
    };

    const { fields, files } = await parseForm(req);

    console.log("Parsed Fields:", fields);
    console.log("Parsed Files:", files);

    const file = files.selectedFile as File | File[] | undefined;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Handle single file
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    const originalFilename = (uploadedFile as any).originalFilename;
    console.log("Uploaded File Details:", originalFilename);

    const filePath = (uploadedFile as any).filepath || (uploadedFile as any).path;
    const fileContent = await fs.readFile(filePath, "utf-8");

    console.log("File Content:", fileContent);

    const dashboardId = req.query.id as string;

    const formData = new FormData();
    formData.append("file", new Blob([fileContent]), originalFilename);

    console.log("formData", formData);
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
    //Fill in the code
    const response = await axios.post(`/dashboards/${dashboardId}/stopwords`,
        formData,
      { headers: 
        {
        "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response)
    return res.status(200);

  } catch (error) {
    console.error('Error fetching data from backend:', error);
    return res.status(500);
  }
}

