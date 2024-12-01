# # # import pandas as pd

# # # data = pd.read_csv('questions.csv')
# # # print(data.iloc[0].Statement)
# # # print(data.columns)
# # # print(data.iloc[0].Answer.strip())
# # # print(len(data))


# # import os

# # # dir_path = 'DiscreteMathematics.wiki'

# # # file_names = os.listdir(dir_path)

# # # for file_name in file_names[1:]:
# # #     name, _ = os.path.splitext(file_name)
# # #     print(name)



# # filename = 'Algorithm'

# # dir_path = 'DiscreteMathematics.wiki' 
# # file_path = os.path.join(dir_path, filename + '.md')
# # print(file_path)



# from docx import Document

# # Create a new Document
# doc = Document()

# # Title and Introduction
# doc.add_heading('Performance Analysis and Evaluation of Drug Classification Models', level=1)
# doc.add_paragraph(
#     "This report evaluates the performance of four classification models: "
#     "K-Nearest Neighbors (KNN), Logistic Regression, Decision Trees, and Support Vector Machines (SVM). "
#     "The analysis is based on key performance metrics such as accuracy, precision, recall, F1-score, and confusion matrices. "
#     "Recommendations are made to determine the most suitable model for drug classification."
# )

# # Section 1: Performance Metrics Extraction
# doc.add_heading('1. Performance Metrics Extraction', level=2)

# # Subsection: K-Nearest Neighbors (KNN)
# doc.add_heading('K-Nearest Neighbors (KNN)', level=3)
# doc.add_paragraph('Confusion Matrix:')
# table_knn_cm = doc.add_table(rows=6, cols=5)
# table_knn_cm.style = 'Table Grid'
# cm_knn_data = [
#     ['drugA', 'drugB', 'drugC', 'drugX', 'drugY'],
#     [6, 0, 0, 0, 0],
#     [0, 3, 0, 0, 0],
#     [1, 0, 2, 1, 1],
#     [1, 0, 0, 9, 1],
#     [0, 0, 0, 0, 15],
# ]
# for i, row_data in enumerate(cm_knn_data):
#     row = table_knn_cm.rows[i]
#     for j, value in enumerate(row_data):
#         row.cells[j].text = str(value)

# doc.add_paragraph('Classification Report:')
# table_knn_cr = doc.add_table(rows=6, cols=5)
# table_knn_cr.style = 'Table Grid'
# cr_knn_data = [
#     ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'],
#     ['drugA', '0.75', '1.00', '0.86', '6'],
#     ['drugB', '1.00', '1.00', '1.00', '3'],
#     ['drugC', '1.00', '0.40', '0.57', '5'],
#     ['drugX', '0.90', '0.82', '0.86', '11'],
#     ['drugY', '0.88', '1.00', '0.94', '15'],
# ]
# for i, row_data in enumerate(cr_knn_data):
#     row = table_knn_cr.rows[i]
#     for j, value in enumerate(row_data):
#         row.cells[j].text = value

# # Subsections for Logistic Regression, Decision Trees, and SVM
# # Redefine the `add_model_metrics` function and retry the process

# def add_model_metrics(doc, title, confusion_matrix, classification_report):
#     """
#     Add confusion matrix and classification report to the Word document.
#     """
#     doc.add_heading(title, level=3)
#     doc.add_paragraph('Confusion Matrix:')
#     table_cm = doc.add_table(rows=len(confusion_matrix), cols=len(confusion_matrix[0]))
#     table_cm.style = 'Table Grid'
#     for i, row_data in enumerate(confusion_matrix):
#         row = table_cm.rows[i]
#         for j, value in enumerate(row_data):
#             row.cells[j].text = str(value)
#     doc.add_paragraph('Classification Report:')
#     table_cr = doc.add_table(rows=len(classification_report), cols=len(classification_report[0]))
#     table_cr.style = 'Table Grid'
#     for i, row_data in enumerate(classification_report):
#         row = table_cr.rows[i]
#         for j, value in enumerate(row_data):
#             row.cells[j].text = value



# # Data for Logistic Regression
# confusion_matrix_lr = [
#     ['drugA', 'drugB', 'drugC', 'drugX', 'drugY'],
#     [6, 0, 0, 0, 0],
#     [0, 3, 0, 0, 0],
#     [0, 0, 4, 0, 1],
#     [0, 0, 0, 11, 0],
#     [0, 0, 0, 0, 15],
# ]
# classification_report_lr = [
#     ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'],
#     ['drugA', '1.00', '1.00', '1.00', '6'],
#     ['drugB', '1.00', '1.00', '1.00', '3'],
#     ['drugC', '1.00', '0.80', '0.89', '5'],
#     ['drugX', '1.00', '1.00', '1.00', '11'],
#     ['drugY', '0.94', '1.00', '0.97', '15'],
# ]

# add_model_metrics(doc, 'Logistic Regression', confusion_matrix_lr, classification_report_lr)

# # Repeat for Decision Tree and SVM
# confusion_matrix_dt = [
#     ['drugA', 'drugB', 'drugC', 'drugX', 'drugY'],
#     [4, 0, 0, 0, 2],
#     [0, 3, 0, 0, 0],
#     [0, 0, 4, 0, 1],
#     [0, 0, 0, 10, 1],
#     [1, 0, 0, 0, 14],
# ]
# classification_report_dt = [
#     ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'],
#     ['drugA', '0.80', '0.67', '0.73', '6'],
#     ['drugB', '1.00', '1.00', '1.00', '3'],
#     ['drugC', '1.00', '0.80', '0.89', '5'],
#     ['drugX', '1.00', '0.91', '0.95', '11'],
#     ['drugY', '0.78', '0.93', '0.85', '15'],
# ]

# add_model_metrics(doc, 'Decision Tree', confusion_matrix_dt, classification_report_dt)

# # Repeat

# confusion_matrix_svm = [
#     ['drugA', 'drugB', 'drugC', 'drugX', 'drugY'],
#     [4, 1, 0, 0, 1],
#     [0, 3, 0, 0, 0],
#     [0, 0, 4, 0, 1],
#     [0, 0, 0, 10, 1],
#     [0, 0, 0, 0, 15],
# ]
# classification_report_svm = [
#     ['Class', 'Precision', 'Recall', 'F1-Score', 'Support'],
#     ['drugA', '1', '0.67', '0.8', '6'],
#     ['drugB', '0.75', '1.00', '0.83', '3'],
#     ['drugC', '1.00', '0.80', '0.89', '5'],
#     ['drugX', '1.00', '0.91', '0.95', '11'],
#     ['drugY', '0.78', '0.93', '0.85', '15'],
# ]

# # Retry the process from where it failed
# add_model_metrics(doc, 'Support Vector Machine (SVM)', confusion_matrix_svm, classification_report_svm)

# # Section 2: Comparative Analysis
# doc.add_heading('2. Comparative Analysis', level=2)
# doc.add_paragraph(
#     "The following table summarizes the key performance metrics (accuracy, precision, recall, and F1-score) for all models:"
# )
# comparison_table = doc.add_table(rows=5, cols=5)
# comparison_table.style = 'Table Grid'
# comparison_data = [
#     ['Metric', 'KNN', 'Logistic Regression', 'Decision Tree', 'SVM'],
#     ['Accuracy', '0.88', '0.97', '0.88', '0.90'],
#     ['Precision', '0.89', '0.98', '0.89', '0.92'],
#     ['Recall', '0.88', '0.97', '0.88', '0.90'],
#     ['F1-Score', '0.86', '0.97', '0.88', '0.90'],
# ]
# for i, row_data in enumerate(comparison_data):
#     row = comparison_table.rows[i]
#     for j, value in enumerate(row_data):
#         row.cells[j].text = value

# # Section 3: Insightful Observations
# doc.add_heading('3. Insightful Observations', level=2)
# doc.add_paragraph('- **Accuracy vs. Precision/Recall**:')
# doc.add_paragraph(
#     "  - Logistic Regression has the highest accuracy (0.97), making it the most reliable model overall."
# )
# doc.add_paragraph(
#     "  - KNN and Decision Trees have identical accuracy (0.88) but differ slightly in precision and recall."
# )
# doc.add_paragraph(
#     "  - SVM strikes a balance between accuracy (0.90) and other metrics, showing robust performance."
# )

# # Section 4: Recommendation
# doc.add_heading('4. Recommendation', level=2)
# doc.add_paragraph(
#     "Based on the analysis, Logistic Regression is the most suitable model for drug classification. "
#     "Its high accuracy, precision, and F1-score make it ideal for reliable predictions. "
#     "To further improve performance, ensemble methods or hyperparameter tuning could be explored."
# )

# # Save the document
# file_path = "/Drug_Classification_Model_Comparison.docx"
# doc.save(file_path)
# file_path

